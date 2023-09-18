import {computed, onMounted, Ref, ref, ShallowRef, shallowRef} from "vue";

export function useCanvas(dom: string | HTMLCanvasElement, {
    initWidth = 500,
    initHeight = 500,
} = {}) {
    const canvas = shallowRef();
    const ctx = shallowRef();

    const width = computed(() => {
        return canvas.value.width
    })

    const height = computed(() => {
        return canvas.value.height
    })

    // 保存绘制轨迹的栈
    const pathStack: ShallowRef<Array<Array<{ x: number; y: number; }>>> = shallowRef([]);
    // 当前绘制的轨迹
    const currentPath: Ref<Array<{ x: number; y: number; }>> = ref([]);
    // 保存撤销的轨迹
    const redoStack: ShallowRef<Array<Array<{ x: number; y: number; }>>> = shallowRef([]);

    // 初始化画布
    onMounted(() => {
        if (typeof dom === 'string') {
            canvas.value = document.getElementById(dom);
        } else if (dom instanceof HTMLCanvasElement) {
            canvas.value = dom;
        } else {
            throw new Error('dom is not a string or HTMLCanvasElement');
        }
        canvas.value.width = initWidth;
        canvas.value.height = initHeight;
        ctx.value = canvas.value.getContext("2d");
        canvas.value.addEventListener("mousedown", (e: MouseEvent) => {
            const {offsetX, offsetY} = e;
            currentPath.value.push({x: offsetX, y: offsetY});
            canvas.value.addEventListener("mousemove", handleMouseMove);
            canvas.value.addEventListener("mouseup", handleMouseUp);
        });
    })


    function drawPath() {
        const _ctx = ctx.value;
        _ctx.clearRect(0, 0, width.value, height.value); // 清空画板
        for (const path of [...pathStack.value, currentPath.value]) {
            _ctx.beginPath();
            for (let i = 0; i < path.length; i++) {
                const {x, y} = path[i];
                if (i === 0) {
                    _ctx.moveTo(x, y);
                } else {
                    _ctx.lineTo(x, y);
                }
            }
            _ctx.stroke();
        }
    }

    function addPath() {
        redoStack.value = []; // 清空重做栈
        if (currentPath.value) {
            pathStack.value.push(currentPath.value);
            currentPath.value = [];
        }
        drawPath();
    }

    function handleMouseMove(e: MouseEvent) {
        const {offsetX, offsetY} = e;
        currentPath.value.push({x: offsetX, y: offsetY});
        drawPath();
    }

    function handleMouseUp() {
        addPath();
        canvas.value.removeEventListener("mousemove", handleMouseMove);
        canvas.value.removeEventListener("mouseup", handleMouseUp);
    }

    // 撤销
    const handleUndo = () => {
        if (pathStack.value.length > 0) {
            const undonePath = pathStack.value.pop();
            if (!undonePath) return;
            redoStack.value.push(undonePath);
            drawPath();
        }
    }
    // 重做
    const handleRedo = () => {
        if (redoStack.value.length > 0) {
            const redonePath = redoStack.value.pop();
            if (!redonePath) return;
            pathStack.value.push(redonePath);
            drawPath();
        }
    }

    // 导出
    const handleExport = () => {
        const dataURL = canvas.value.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "canvas.png";
        link.click();
    }

    return {handleUndo, handleRedo, handleExport}
}

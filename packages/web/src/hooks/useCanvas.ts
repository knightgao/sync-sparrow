import {computed, onMounted, Ref, ref, ShallowRef, shallowRef, watch} from "vue";

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
    let pathStack: Array<Array<{ x: number; y: number; }>> = [];
    // 当前绘制的轨迹
    let currentPath: Array<{ x: number; y: number; }> = [];
    // 保存撤销的轨迹
    let redoStack: Array<Array<{ x: number; y: number; }>> = [];

    // 绘画路径
    const drawPathShow = shallowRef();

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
            currentPath.push({x: offsetX, y: offsetY});
            canvas.value.addEventListener("mousemove", handleMouseMove);
            canvas.value.addEventListener("mouseup", handleMouseUp);
        });
    })


    function drawPath() {
        const _ctx = ctx.value;
        _ctx.clearRect(0, 0, width.value, height.value); // 清空画板
        for (const path of [...pathStack, currentPath]) {
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
        redoStack = []; // 清空重做栈
        if (currentPath.length > 0) {
            pathStack.push([...currentPath]);
            drawPathShow.value = [...pathStack];
            currentPath = [];
        }
        drawPath();
    }

    function handleMouseMove(e: MouseEvent) {
        const {offsetX, offsetY} = e;
        currentPath.push({x: offsetX, y: offsetY});
        drawPath();
    }

    function handleMouseUp() {
        addPath();
        canvas.value.removeEventListener("mousemove", handleMouseMove);
        canvas.value.removeEventListener("mouseup", handleMouseUp);
    }

    // 撤销
    const handleUndo = () => {
        if (pathStack.length > 0) {
            const undonePath = pathStack.pop();
            drawPathShow.value = [...pathStack];
            if (!undonePath) return;
            redoStack.push(undonePath);
            drawPath();
        }
    }
    // 重做
    const handleRedo = () => {
        if (redoStack.length > 0) {
            const redonePath = redoStack.pop();
            if (!redonePath) return;
            pathStack.push(redonePath);
            drawPathShow.value = [...pathStack];
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


 

    // 设置回显数据
    const setPathStack = (value:any)=>{
        if(value){
            pathStack = value;
            drawPathShow.value = [...pathStack];
            drawPath();
        }
    }


    return {handleUndo, handleRedo, handleExport,drawPathShow,setPathStack}
}

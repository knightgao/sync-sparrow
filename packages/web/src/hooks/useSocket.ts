import { ref, onUnmounted, computed } from "vue";
import { io } from "socket.io-client";



export function useSocket(sockerUrl: string = '', {
    autoConnect = true,
    ...option
} = {}) {
    const state = ref({
        connected: false,
        roomEvents: [],
        gameEvents: []
    });
    const url = sockerUrl || process.env.NODE_ENV === "production" ? "" : "http://localhost:3000";
    let socket = io(url, { ...option });


    socket.on("connect", () => {
        state.value.connected = true;
    });

    socket.on("disconnect", () => {
        state.value.connected = false;
    });

    socket.on("room", (...args) => {
        state.value.roomEvents.push(args);
    });

    const connect = () => {
        socket?.connect();
    }

    const disconnect = () => {
        socket?.disconnect()
    }


    const isConnected = computed(() => {
        return state.value.connected
    })

    onUnmounted(
        () => {
            disconnect();
            // 此处不知道有没有用
            // socket = null;
            // state.value = null;
        }
    )

    return {
        state,
        socket,
        connect,
        disconnect,
        isConnected
    }
}
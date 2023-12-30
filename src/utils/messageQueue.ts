const messageQueue: any[] = []; 

export const addMessage = (message: any) => {
    messageQueue.push(message);
}

export const getMessages = () => {
    return messageQueue;
}

export const clearMessages = () => {
    messageQueue.length = 0;
}

export const getFirstMessage = () => {
    return messageQueue[0];
}

export const removeFirstMessage = () => {
    messageQueue.shift();
}
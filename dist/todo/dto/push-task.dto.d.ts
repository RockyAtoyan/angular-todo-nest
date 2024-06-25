export declare class PushTaskDto {
    taskId: string;
    dropTaskId?: string;
    direction?: 'bottom' | 'top';
    order?: number;
    prevTodoId: string;
}

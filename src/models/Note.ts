
import { ObjectId } from 'mongodb';

export interface Note {
    _id?: ObjectId;
    id?: string; // for client-side serialization
    title: string;
    content: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    tags?: string[];
    archived?: boolean;
    locked?: boolean;
    password?: string;
    pinned?: boolean;
    dueDate?: Date | string;
}

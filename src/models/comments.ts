import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
    content: string;
    username: string; 
    blog_id: string; 
}

const commentSchema: Schema = new Schema({
    content: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    blog_id: {
        type: String, 
        required: true
    }
}, { timestamps: true });

const Comment = mongoose.model<IComment>('Comment', commentSchema);

export default Comment;

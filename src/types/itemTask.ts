import {Comment} from './comment'

export type TaskProps = {
    item: {
        id: string,
        task: string,
        created: string,
        user: string,
        public: boolean
    },

    allComments: Comment[]
}
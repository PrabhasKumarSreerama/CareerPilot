import mongoose from 'mongoose'

const blocklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    }
},{
    timestamps: true
})


const BlocklistTokenModel = mongoose.model('BlocklistTokens', blocklistTokenSchema)

export default BlocklistTokenModel

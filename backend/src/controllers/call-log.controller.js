import { Caller } from "../models/emergency-call-log.model.js"

const addCaller = async (req,res) => {
    try {
        const {callerInfo} = req.body
        const user = req.user
    
        const existedCallLog = await Caller.aggregate([
            {$match: {
                "callerDetail" : callerInfo
            }}
        ])

        // console.log(existedCallLog)
    
        if (existedCallLog[0]) {
    
            return res.json({
                message: "Caller detail already existed.",
                success: true
            })
        }
    
        const callLog = await Caller.create({
            userID: user._id,
            callerDetail: callerInfo
        })
    
        const createdCallLog = await Caller.findById(callLog._id)
    
        return res.json({
            message: createdCallLog,
            success: true
        })
    } catch (error) {
        console.log(error)
        return
    }

}


const deleteCaller = async (req,res) => {
    const {id} = req.body
    const user = req.user

    const caller = await Caller.findById(id)
    // console.log(user._id , caller.userID , caller)

    if (user._id.toString() !== caller.userID.toString()) {
        return res.json({
            message: "Unauthorized request.",
            success: false
        })
    }

    await Caller.findByIdAndDelete(id)

    return res.json({
        message: "Caller info deleted successfully.",
        success: true
    })
}


const getCaller = async (req,res) => {
    const userID = req.user._id

    const callerDetail = await Caller.find({userID})

    return res.json({
        message: "Data fetched successfully.",
        data: callerDetail,
        success: true
    })
}


export {addCaller, deleteCaller, getCaller}
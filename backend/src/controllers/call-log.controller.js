import { Caller } from "../models/emergency-call-log.model.js";
import twilio from "twilio";
import { User } from "../models/user.model.js";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const createCall = async (req, res) => {
  const userID = req.user._id;

  const user = await User.findById(userID);

  const callerDetail = await Caller.find({ userID });
  console.log(callerDetail[0].number, callerDetail);

  const client = twilio(accountSid, authToken);

  for (let index = 0; index < callerDetail.length; index++) {
    const element = callerDetail[index];
    const call = await client.calls.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${element.callerDetail.number}`,
      twiml: `
      <Response>
      <Pause />
      <Say language="hi-IN" voice="Kajal-Neural" > Hi <Pause/> ${element.callerDetail.name} , <Pause/> your <Pause/> ${element.callerDetail.relation} <Pause/> , ${user.fullName} <Pause/> need your help. Either you <Pause/> call her or <Pause/> track their location.</Say>
      <Pause/> 
      </Response>`,
    });
  }

  //   console.log(call.sid);

  return res.json({
    message: "All calls ended.",
    success: true,
  });
};

const addCaller = async (req, res) => {
  try {
    const { callerInfo } = req.body;
    const user = req.user;

    const existedCallLog = await Caller.aggregate([
      {
        $match: {
          callerDetail: callerInfo,
        },
      },
    ]);

    // console.log(existedCallLog)

    if (existedCallLog[0]) {
      return res.json({
        message: "Caller detail already existed.",
        success: true,
      });
    }

    const callLog = await Caller.create({
      userID: user._id,
      callerDetail: callerInfo,
    });

    const createdCallLog = await Caller.findById(callLog._id);

    return res.json({
      message: createdCallLog,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return;
  }
};

const deleteCaller = async (req, res) => {
  const { id } = req.body;
  const user = req.user;

  const caller = await Caller.findById(id);
  // console.log(user._id , caller.userID , caller)

  if (user._id.toString() !== caller.userID.toString()) {
    return res.json({
      message: "Unauthorized request.",
      success: false,
    });
  }

  await Caller.findByIdAndDelete(id);

  return res.json({
    message: "Caller info deleted successfully.",
    success: true,
  });
};

const getCaller = async (req, res) => {
  const userID = req.user._id;

  const callerDetail = await Caller.find({ userID });

  return res.json({
    message: "Data fetched successfully.",
    data: callerDetail,
    success: true,
  });
};

export { createCall, addCaller, deleteCaller, getCaller };

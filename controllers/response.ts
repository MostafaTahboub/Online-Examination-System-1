import { Exam } from "../DB/Entities/Exam.js";
import { Response } from "../DB/Entities/Response.js";

const insertResponse = (payload: Response) => {
    const newResponse = Response.create(payload);
    // Exam.findOneBy({name: payload.exam})
    return newResponse.save();
}

const getAllResponses = async (payload: GetAll) => {
    const page = parseInt(payload.page)
    const pageSize = parseInt(payload.pageSize);
    const [Responses, total] = await Response.findAndCount({
        skip: pageSize * (page - 1),
        take: pageSize,
    })

    return {
        page,
        pageSize: Responses.length,
        total,
        Responses
    }
}
export {insertResponse, getAllResponses}
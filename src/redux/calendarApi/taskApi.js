import axiosJWT, { genURL } from "../axiosConfig";

export const CreateTask = async (data, accessToken) => {
  try {
    const res = await axiosJWT.post(`${genURL("/v1/task/")}`, data, {
      headers: { token: `Bearer ${accessToken}` },
    });
    return res.data;
  } catch (error) {}
};

export const UpdateTask = async (taskId, dataList, accessToken) => {
  try {
    const res = await axiosJWT.put(
      `${genURL(`/v1/task/${taskId}`)}`,
      dataList,
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    return res.data;
  } catch (error) {}
};

export const DeleteTask = async (taskId, sectionId, accessToken) => {
  try {
    const res = await axiosJWT.delete(`${genURL(`/v1/task/${taskId}`)}`, {
      headers: { token: `Bearer ${accessToken}` },
      data: {
        taskId,
        sectionId,
      },
    });
    return res.data;
  } catch (error) {}
};
export const UpdatePositionTask = async (
  taskOrder,
  sectionId,
  sectionIdAdded,
  taskId,
  accessToken
) => {
  try {
    const res = await axiosJWT.put(
      `${genURL("/v1/task")}`,
      { taskOrder, sectionId, sectionIdAdded, taskId },
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    return res.data;
  } catch (error) {}
};

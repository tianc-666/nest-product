/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, message } from "antd";
import LoginRegisterForm from "../components/LoginRegisterForm";
import type { UserInfo } from "../Register";
import { useState } from "react";
import { useRequest } from "ahooks";
import { userService } from "../../../action/user";

const UserPage = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { run } = useRequest(userService.getUserInfo, {
    manual: false,
    onSuccess: (res: any) => {
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      setUserInfo(res.data);
    },
  });
  const onModifyUserInfo = async (values: UserInfo) => {
    const res = await userService.updateUserInfo(values);
    if (res.data) {
      run();
      message.success("修改成功");
    }
  };

  return (
    <div>
      <LoginRegisterForm
        type={"edit"}
        onSubmit={onModifyUserInfo}
        initialValues={userInfo}
        submitButton={
          <>
            <Button type="primary" htmlType="submit" className="w-full">
              修改信息
            </Button>
          </>
        }
      />
    </div>
  );
};

export default UserPage;

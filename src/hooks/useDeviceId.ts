import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const useDeviceId = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    let storedId = localStorage.getItem("deviceId");
    if (!storedId) {
      storedId = uuidv4();
      localStorage.setItem("deviceId", storedId);
    }
    setDeviceId(storedId);
  }, []);

  return deviceId;
};

export const RULES = {
	deviceId: [
		{
			required: true,
			message: '请输入 DeviceId',
			trigger: 'blur',
		},
	],
	groupId: [
		{
			required: true,
			message: '请输入 GroupId',
			trigger: 'blur',
		},
	],
};

export const HOSTNAME = 'ws://10.10.122.212:8000';
export const PORT = 8000;

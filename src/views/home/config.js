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

export const HOSTNAME = 'ws://118.24.169.3/mqtt';
// export const HOSTNAME = 'ws://localhost:8000/mqtt';
export const PORT = 8000;

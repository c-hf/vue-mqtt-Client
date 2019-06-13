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
// export const HOSTNAME = 'tcp://localhost:8000';
export const PORT = 3000;

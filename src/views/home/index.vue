<template>
    <el-row class="home">
        <el-col class="home-lamp"
                :span="18"
                :md="16">
            <div class="lamp"
                 :style="{'background-image': background,'box-shadow': shadow}">
                <span class="gonna-give-light">
                </span>
            </div>
        </el-col>
        <el-col class="home-operation"
                :span="6"
                :md="8">
            <el-form :model="lampData"
                     :rules="rules"
                     label-position="left"
                     ref="lampForm"
                     label-width="80px">
                <el-form-item label="群组 ID"
                              prop="groupId">
                    <el-input :disabled="disabled"
                              v-model="lampData.groupId"></el-input>
                </el-form-item>
                <el-form-item label="DeviceID"
                              prop="deviceId">
                    <el-input :disabled="disabled"
                              v-model="lampData.deviceId"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button :disabled="disabled"
                               type="primary"
                               @click="connect('lampForm')">
                        连接
                    </el-button>
                    <el-button @click="disconnect">
                        断开
                    </el-button>
                </el-form-item>
            </el-form>
            <div class="home-operation-switch">
                <el-slider v-model="status.luminance"
                           vertical
                           height="100px"
                           :step="10"
                           :min="10"
                           @change="luminanceValue">
                </el-slider>
                <el-tooltip class="item"
                            effect="dark"
                            content="开关"
                            placement="top">
                    <el-button plain
                               circle
                               @click="setSwitch"
                               :class="{ 'home-operation-switch-on': status.switch}">
                        <svg-icon iconClass="icon-guanbi" />
                    </el-button>
                </el-tooltip>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import storage from '@/assets/js/storage';
import { RULES, HOSTNAME, PORT } from './config.js';
import mqtt from 'mqtt';

export default {
	name: 'Home',
	data() {
		return {
			client: {},
			lampData: {},
			status: {
				switch: false,
				luminance: 100,
			},
			disabled: false,
			rules: RULES,
			hostname: HOSTNAME,
			port: PORT,
		};
	},

	computed: {
		pubTopic() {
			if (this.lampData.deviceId && this.lampData.groupId) {
				return `device/status/${this.lampData.groupId}/${
					this.lampData.deviceId
				}`;
			} else {
				return 'device/status';
			}
		},

		subTopic() {
			if (this.lampData.deviceId && this.lampData.groupId) {
				return `device/desired/${this.lampData.groupId}/${
					this.lampData.deviceId
				}`;
			} else {
				return 'device/desired';
			}
		},

		shadow() {
			if (!this.status.switch || this.status.luminance === 0) {
				return '';
			}
			return `0px 2px 5px rgba(255,253,220, ${0.6 *
				this.status.luminance}) inset,
            0px 2px 10px rgba(255,253,220, ${(0.6 * this.status.luminance) /
				100}),
            0px 5px 40px 10px rgba(255,253,220, ${(0.6 *
				this.status.luminance) /
				100}),
            0px 8px 80px ${(22.2 * this.status.luminance + 17.8) /
				100}px rgba(255,253,220, ${(0.4 * this.status.luminance) /
				100}),
            0px 8px 120px ${(44.4 * this.status.luminance + 35.6) /
				100}px rgba(255,253,220, ${(0.2 * this.status.luminance) /
				100})`;
		},

		background() {
			if (!this.status.switch || this.status.luminance === 0) {
				return '';
			}
			return `radial-gradient(
                rgba(255,254,255, ${(0.1 * this.status.luminance + 90) /
					100}) 5%,
                rgba(255,253,220, ${(0.2 * this.status.luminance + 80) /
					100}) 100%)`;
		},
	},

	methods: {
		// 开关
		setSwitch() {
			this.status.switch
				? this.switchValue(false)
				: this.switchValue(true);
		},

		// 开关设置
		switchValue(value) {
			this.status.switch = value;
			this.publishFn({ switch: this.status.switch });
		},

		// 亮度设置
		luminanceValue(value) {
			this.status.luminance = value;
			this.publishFn({ luminance: this.status.luminance });
		},

		// mqtt
		mqttConnect(data) {
			const options = {
				username: data.userName,
				password: data.password,
				clientId: data.clientId,
				cleanSession: false,
				keepalive: 30,
				will: {
					topic: 'device/disconnecting',
					payload: JSON.stringify(data.clientId),
					qos: 1,
				},
			};
			this.client = mqtt.connect(this.hostname, options);
			this.client.on('connect', this.onConnect);
			this.client.on('message', this.onMessage);
			this.client.on('error', this.onError);
			this.client.on('close', this.onClose);
		},

		// 发送封装
		publishFn(data) {
			if (!this.client.connected) {
				return;
			}
			this.publish({
				reported: data,
			});
		},

		// 连接
		connect(formName) {
			this.$refs[formName].validate(valid => {
				if (!valid) {
					return false;
				}
				const data = {
					userName: this.lampData.groupId,
					password: this.lampData.deviceId,
					clientId: this.lampData.deviceId,
				};
				this.mqttConnect(data);
			});
		},

		// 断开链接
		disconnect() {
			if (!this.client) {
				return;
			}
			if (this.client.connected) {
				this.client.end();
			}
		},

		// 断开链接回调
		onClose() {
			console.log('disconnect...');
			this.disabled = false;
			this.$notify.info({
				title: '消息',
				message: `设备 ${this.client.options.clientId} 已断开连接！`,
				position: 'bottom-right',
			});
		},

		// 连接成功回调
		onConnect() {
			console.log('connect...');
			this.disabled = true;
			storage.set('lampData', this.lampData);
			this.$notify({
				title: '消息',
				message: `设备 ${this.client.options.clientId} 连接成功！`,
				type: 'success',
				position: 'bottom-right',
			});

			// 发布
			this.publish({
				reported: {
					switch: this.status.switch,
					luminance: this.status.luminance,
				},
			});
			// 订阅
			this.client.subscribe(this.subTopic, { qos: 1 });
		},

		// 断开连接
		disConnect() {
			if (this.client.connected) {
				this.client.end();
			}
		},

		// 错误回调
		onError(error) {
			console.log('MqttError: ', error);
		},

		// 接收消息回调
		onMessage(topic, message) {
			const data = JSON.parse(message.toString());
			const keys = Object.keys(data.desired);
			const reqData = {};
			keys.forEach(el => {
				this.status[el] = data.desired[el];
				reqData[el] = this.status[el];
			});
			this.publishFn(reqData);
		},

		// 发布主题
		publish(data) {
			this.client.publish(this.pubTopic, JSON.stringify(data), {
				qos: 1,
				retain: true,
			});
		},

		// 获取本地信息
		getlampData() {
			const data = storage.get('lampData');
			if (data) {
				this.lampData = data;
			} else {
				this.lampData = {
					deviceId: '',
					groupId: '',
				};
			}
		},
	},

	created() {
		this.getlampData();
	},

	beforeDestroy() {
		this.disConnect();
	},
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/mixins';

.home {
	width: 100%;
	height: 100%;

	&-lamp {
		height: 100%;
		background: #2f323c;
		position: relative;
		overflow: hidden;
	}

	&-operation {
		height: 100%;

		.el-form {
			margin: 20px;
			margin-top: 100px;
			width: 80%;
		}

		&-switch {
			widows: 100%;
			margin-top: 50px;

			@include flex-around();

			&-on {
				border-color: #67c23a;
				color: #67c23a;
			}
		}
	}
}

.lamp {
	width: 150px;
	height: 150px;
	margin: auto;
	margin-top: 100px;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0);
	border: 1px solid rgba(255, 255, 255, 0.2);
	box-shadow: 0px 0px 1px rgba(255, 255, 255, 0.8);
	transition: all 0.15s;
	position: relative;
}

.lamp::after {
	content: '';
	display: block;
	top: -72px;
	left: 50%;
	width: 20px;
	height: 80px;
	margin-left: -10px;
	position: absolute;
	background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
		linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
		linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7));
	background-repeat: no-repeat;
	background-size: 2px 52px, 6px 12px, 10px 20px;
	background-position: 50% 0, 50% 40px, 50% 50px;
}

.lamp::before {
	left: -1.65rem;
	bottom: -4rem;
	width: 4rem;
	height: 4rem;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.03);
	transition: all 0.15s;
}

.gonna-give-light,
.gonna-give-light::before {
	position: absolute;
}

.gonna-give-light {
	top: 0;
	left: 50%;
	width: 0;
	height: 50px;
	margin-left: -1px;
	border-right: 2px solid rgba(255, 255, 255, 0.1);
}

.gonna-give-light::before {
	content: '';
	top: 50px;
	left: 50%;
	width: 30px;
	height: 30px;
	border-radius: 50%;
	margin-left: -15px;
	border: 2px solid rgba(255, 255, 255, 0.1);
}
</style>

import { RTCRtpTransceiverAsJSON } from './RTCRtpTransceiver';

const exec = require('cordova/exec'),
	pluginName = 'iosrtcPlugin';

export interface TransceiversUpdateEvent {
	transceivers: RTCRtpTransceiverAsJSON[];
}

export function executeInCordova<T>(method: string, ...args: any[]): Promise<T> {
	return new Promise((resolve, reject) => {
		exec(
			(result: T) => resolve(result),
			(error: any) => reject(error),
			pluginName,
			method,
			args
		);
	});
}

// export function addTrackToPeerConnection(
// 	peerConnectionId: string,
// 	trackId: string,
// 	options: any // TODO
// ) {
// 	return executeInCordova<RTCRtpTransceiverAsJSON>(
// 		'RTCPeerConnection_addTransceiver',
// 		peerConnectionId,
// 		source
// 	);
// }

export function addTransceiverToPeerConnection(
	peerConnectionId: number,
	source: string,
	receiverTrackId: string,
	initOptions?: {
		direction: RTCRtpTransceiverDirection;
		streamIds: string[];
	}
) {
	console.log('Adding Trans', peerConnectionId, source, receiverTrackId, initOptions);

	return executeInCordova<TransceiversUpdateEvent>(
		'RTCPeerConnection_addTransceiver',
		peerConnectionId,
		source,
		receiverTrackId,
		initOptions
	);
}

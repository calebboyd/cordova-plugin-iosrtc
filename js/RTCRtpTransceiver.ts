import { RTCRtpReceiverAsJSON, RTCRtpReceiverShim } from './RTCRtpReceiver';
import { RTCRtpSenderAsJSON, RTCRtpSenderShim } from './RTCRtpSender';
import { RTCPeerConnectionShim } from './RTCPeerConnection';

interface TransceiverBaseProperties {
	currentDirection: RTCRtpTransceiverDirection;
	direction: RTCRtpTransceiverDirection;
	mid: string | null;
	stopped: boolean;
}

export interface RTCRtpTransceiverAsJSON extends TransceiverBaseProperties {
	receiver: RTCRtpReceiverAsJSON;
	sender: RTCRtpSenderAsJSON;
}

interface LocalTransceiverInput extends TransceiverBaseProperties {
	receiver: RTCRtpReceiverShim;
	sender: RTCRtpSenderShim;
}

export class RTCRtpTransceiverShim implements RTCRtpTransceiver {
	public readonly receiver: RTCRtpReceiverShim;
	public readonly sender: RTCRtpSenderShim;
	private _direction: RTCRtpTransceiverDirection;
	private _currentDirection: RTCRtpTransceiverDirection | null = null;
	private _mid: string | null = null;
	private _stopped = false;

	constructor(
		private pc: RTCPeerConnectionShim,
		data: RTCRtpTransceiverAsJSON | LocalTransceiverInput
	) {
		this.receiver =
			data.receiver instanceof RTCRtpReceiverShim
				? data.receiver
				: new RTCRtpReceiverShim(pc, data.receiver);
		this.sender =
			data.sender instanceof RTCRtpSenderShim
				? data.sender
				: new RTCRtpSenderShim(pc, data.sender);

		this._direction = data.direction;
		this._currentDirection = data.currentDirection;
		this._mid = data.mid;
		this._stopped = data.stopped;
	}

	update(update: RTCRtpTransceiverAsJSON) {
		// this.id = update.id;
		this._direction = update.direction;
		this._currentDirection = update.currentDirection;
		this._mid = update.mid;
		this._stopped = update.stopped;

		this.receiver.update(update.receiver);
		this.sender.update(update.sender);
	}

	get receiverId() {
		return this.receiver.track.id;
	}
	get direction() {
		return this._direction;
	}
	set direction(val) {
		if (this.isStopped) {
			throw Error('Transceiver Stopped');
		}
		this._direction = val;

		// TODO

		// WebRTCModule.peerConnectionTransceiverSetDirection(this._peerConnectionId, this.id, val, (successful, data) => {
		// 	if (successful) {
		// 		this._mergeState(data.state);
		// 	} else {
		// 		console.warn("Unable to set direction: " + data);
		// 	}
		// });
	}
	get currentDirection() {
		return this._currentDirection;
	}
	get mid() {
		return this._mid;
	}
	get isStopped() {
		return this._stopped;
	}
	get stopped() {
		return this._stopped;
	}

	/**
	 * Additional, unimplemented members
	 */
	setCodecPreferences(codecs: RTCRtpCodecCapability[]): void {
		void codecs;
		throw new Error('RTCRtpTransceiver.setCodecPreferences not implemented');
	}
	stop(): void {}
}

// TODO
// https://developer.mozilla.org/en-US/docs/Web/API/RTCRtpTransceiver/currentDirection
// https://developer.mozilla.org/en-US/docs/Web/API/RTCRtpTransceiverDirection
// https://developer.mozilla.org/en-US/docs/Web/API/RTCRtpTransceiver/mid
// https://developer.mozilla.org/en-US/docs/Web/API/RTCRtpTransceiver/stop

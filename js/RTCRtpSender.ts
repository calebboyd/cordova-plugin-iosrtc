import { MediaStreamTrackAsJSON, MediaStreamTrackShim } from './MediaStreamTrack';
import { RTCPeerConnectionShim } from './RTCPeerConnection';

export interface RTCRtpSenderAsJSON {
	track: MediaStreamTrackAsJSON | null;
}

export class RTCRtpSenderShim implements RTCRtpSender {
	private readonly _pc: RTCPeerConnectionShim;
	public track: MediaStreamTrackShim | null;
	public params: RTCRtpSendParameters;

	constructor(
		pc: RTCPeerConnectionShim,
		data: RTCRtpSenderAsJSON | { track: MediaStreamTrackShim | null }
	) {
		this._pc = pc;
		this.track = data.track ? pc.getOrCreateTrack(data.track) : null;
		this.params = {} as RTCRtpSendParameters;
	}

	getParameters() {
		return this.params;
	}

	setParameters(params: RTCRtpSendParameters) {
		Object.assign(this.params, params);
		return Promise.resolve();
	}

	replaceTrack(withTrack: MediaStreamTrackShim | null): Promise<void> {
		const pc = this._pc;

		return new Promise((resolve, reject) => {
			pc.removeTrack(this);
			if (withTrack) {
				pc.addTrack(withTrack);
			}
			this.track = withTrack;

			// https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/negotiationneeded_event
			pc.dispatchEvent(new Event('negotiationneeded'));

			pc.addEventListener('signalingstatechange', function listener() {
				if (pc.signalingState === 'closed') {
					pc.removeEventListener('signalingstatechange', listener);
					reject();
				} else if (pc.signalingState === 'stable') {
					pc.removeEventListener('signalingstatechange', listener);
					resolve();
				}
			});
		});
	}

	update({ track }: RTCRtpSenderAsJSON) {
		if (track) {
			this.track = this._pc.getOrCreateTrack(track);
		} else {
			this.track = null;
		}

		// TODO additional fields
	}

	/**
	 * Additional, unimplemented members
	 */
	readonly dtmf = null;
	readonly rtcpTransport = null;
	readonly transport = null;

	getStats(): Promise<RTCStatsReport> {
		throw new Error('RTCRtpSender.getStats not implemented');
	}

	setStreams(...streams: MediaStream[]) {
		void streams;
		throw new Error('RTCRtpSender.setStreams not implemented');
	}
}

import { MediaStreamTrackAsJSON, MediaStreamTrackShim } from './MediaStreamTrack';
import { RTCPeerConnectionShim } from './RTCPeerConnection';

export interface RTCRtpReceiverAsJSON {
	track: MediaStreamTrackAsJSON;
	//transport: TODO
}

export class RTCRtpReceiverShim implements RTCRtpReceiver {
	public track: MediaStreamTrackShim;

	constructor(
		private pc: RTCPeerConnectionShim,
		data: RTCRtpReceiverAsJSON | { track: MediaStreamTrackShim }
	) {
		this.track = pc.getOrCreateTrack(data.track);
	}

	update(update: RTCRtpReceiverAsJSON) {
		this.track = this.pc.getOrCreateTrack(update.track);
		// TODO additional fields
	}

	/**
	 * Additional, unimplemented members
	 */
	readonly rtcpTransport = null;
	readonly transport = null;

	getContributingSources(): RTCRtpContributingSource[] {
		return [];
	}

	getParameters(): RTCRtpReceiveParameters {
		throw new Error('RTCRtpReceiver.getParameters not implemented');
	}

	getStats(): Promise<RTCStatsReport> {
		throw new Error('RTCRtpReceiver.getStats not implemented');
	}

	getSynchronizationSources(): RTCRtpSynchronizationSource[] {
		return [];
	}
}

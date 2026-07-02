import type { RemoteTemplateData } from './types';

const toolbarInsertedBlocks = new Set< string >();
let remoteTemplates: RemoteTemplateData | undefined;

export function markToolbarInsertedBlock( clientId: string ) {
	toolbarInsertedBlocks.add( clientId );
}

export function isToolbarInsertedBlock( clientId: string ) {
	return toolbarInsertedBlocks.has( clientId );
}

export function clearToolbarInsertedBlock( clientId: string ) {
	toolbarInsertedBlocks.delete( clientId );
}

export function getRemoteTemplates() {
	return remoteTemplates;
}

export function setRemoteTemplates( templates: RemoteTemplateData ) {
	remoteTemplates = templates;
}

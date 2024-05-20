/**
  * Represents the response data for a client.
*/
export interface ClientResponse {
  /**
    * The unique identifier for the client.
  */
  clientId: string;
}

/**
  * Represents the response data for an instance.
*/
export interface InstanceResponse {
  /**
    * The unique identifier for the instance.
  */
  instanceId: string;
}

/**
  * Represents the response data for a document.
*/
export interface DocumentResponse {
  /**
    * The unique identifier for the document.
  */
  documentId: string;
}

/**
  * Represents the status for a document.
*/
export interface DocumentReady {
  /**
    * The status for the document.
  */
  documentReady: boolean;
}
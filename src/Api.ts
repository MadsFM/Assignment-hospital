/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Diseases {
  /**
   * Note:
   * This is a Primary Key.<pk/>
   * @format integer
   */
  id?: number;
  /**
   * @format character varying
   * @maxLength 255
   */
  name: string;
}

export interface Diagnoses {
  /**
   * Note:
   * This is a Primary Key.<pk/>
   * @format integer
   */
  id?: number;
  /**
   * Note:
   * This is a Foreign Key to `patients.id`.<fk table='patients' column='id'/>
   * @format integer
   */
  patient_id: number;
  /**
   * Note:
   * This is a Foreign Key to `diseases.id`.<fk table='diseases' column='id'/>
   * @format integer
   */
  disease_id: number;
  /**
   * @format timestamp with time zone
   * @default "CURRENT_TIMESTAMP"
   */
  diagnosis_date?: string;
}

export interface Patients {
  /**
   * Note:
   * This is a Primary Key.<pk/>
   * @format integer
   */
  id?: number;
  /**
   * @format character varying
   * @maxLength 255
   */
  name: string;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://localhost:3000" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title standard public schema
 * @version 12.2.3
 * @baseUrl http://localhost:3000
 * @externalDocs https://postgrest.org/en/v12/references/api.html
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Introspection
   * @name GetRoot
   * @summary OpenAPI description (this document)
   * @request GET:/
   */
  getRoot = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/`,
      method: "GET",
      ...params,
    });

  diseases = {
    /**
     * No description
     *
     * @tags diseases
     * @name DiseasesList
     * @request GET:/diseases
     */
    diseasesList: (
      query?: {
        id?: string;
        name?: string;
        /** Filtering Columns */
        select?: string;
        /** Ordering */
        order?: string;
        /** Limiting and Pagination */
        offset?: string;
        /** Limiting and Pagination */
        limit?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Diseases[], any>({
        path: `/diseases`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags diseases
     * @name DiseasesCreate
     * @request POST:/diseases
     */
    diseasesCreate: (
      diseases: {
        name: string;
      },
      query?: {
        /** Filtering Columns */
        select?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Diseases[], any>({
        path: `/diseases`,
        method: "POST",
        query: query,
        body: diseases,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags diseases
     * @name DiseasesDelete
     * @request DELETE:/diseases
     */
    diseasesDelete: (
      query?: {
        id?: string;
        name?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/diseases`,
        method: "DELETE",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags diseases
     * @name DiseasesPartialUpdate
     * @request PATCH:/diseases
     */
    diseasesPartialUpdate: (
      diseases: {
        name: string;
      },
      query?: {
        id?: string;
        name?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/diseases`,
        method: "PATCH",
        query: query,
        body: diseases,
        ...params,
      }),
  };
  diagnoses = {
    /**
     * No description
     *
     * @tags diagnoses
     * @name DiagnosesList
     * @request GET:/diagnoses
     */
    diagnosesList: (
      query?: {
        id?: string;
        patient_id?: string;
        disease_id?: string;
        diagnosis_date?: string;
        /** Filtering Columns */
        select?: string;
        /** Ordering */
        order?: string;
        /** Limiting and Pagination */
        offset?: string;
        /** Limiting and Pagination */
        limit?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Diagnoses[], any>({
        path: `/diagnoses`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags diagnoses
     * @name DiagnosesCreate
     * @request POST:/diagnoses
     */
    diagnosesCreate: (
      diagnoses: {
        patient_id: number;
        disease_id: number;
        /** @format date-time */
        diagnosis_date?: string;
      },
      query?: {
        /** Filtering Columns */
        select?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Diagnoses[], any>({
        path: `/diagnoses`,
        method: "POST",
        query: query,
        body: diagnoses,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags diagnoses
     * @name DiagnosesDelete
     * @request DELETE:/diagnoses
     */
    diagnosesDelete: (
      query?: {
        id?: string;
        patient_id?: string;
        disease_id?: string;
        diagnosis_date?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/diagnoses`,
        method: "DELETE",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags diagnoses
     * @name DiagnosesPartialUpdate
     * @request PATCH:/diagnoses
     */
    diagnosesPartialUpdate: (
      diagnoses: {
        patient_id: number;
        disease_id: number;
        /** @format date-time */
        diagnosis_date?: string;
      },
      query?: {
        id?: string;
        patient_id?: string;
        disease_id?: string;
        diagnosis_date?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/diagnoses`,
        method: "PATCH",
        query: query,
        body: diagnoses,
        ...params,
      }),
  };
  patients = {
    /**
     * No description
     *
     * @tags patients
     * @name PatientsList
     * @request GET:/patients
     */
    patientsList: (
      query?: {
        id?: string;
        name?: string;
        /** Filtering Columns */
        select?: string;
        /** Ordering */
        order?: string;
        /** Limiting and Pagination */
        offset?: string;
        /** Limiting and Pagination */
        limit?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Patients[], any>({
        path: `/patients`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags patients
     * @name PatientsCreate
     * @request POST:/patients
     */
    patientsCreate: (
      patients: {
        name: string;
      },
      query?: {
        /** Filtering Columns */
        select?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Patients[], any>({
        path: `/patients`,
        method: "POST",
        query: query,
        body: patients,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags patients
     * @name PatientsDelete
     * @request DELETE:/patients
     */
    patientsDelete: (
      query?: {
        id?: string;
        name?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/patients`,
        method: "DELETE",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags patients
     * @name PatientsPartialUpdate
     * @request PATCH:/patients
     */
    patientsPartialUpdate: (
      patients: {
        name: string;
      },
      query?: {
        id?: string;
        name?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/patients`,
        method: "PATCH",
        query: query,
        body: patients,
        ...params,
      }),
  };
}

import axios from "axios";
import { START_TAG, END_TAG } from "../utils/parseSnippet";
import { SummaryLanguage } from "../views/search/types";

type Config = {
  filter: string;
  query_str?: string;
  language?: SummaryLanguage;
  includeSummary?: boolean;
  customerId: string;
  corpusId: string;
  endpoint: string;
  apiKey: string;
  exactKeyword?: string;
};

export const sendSearchRequest = async ({
  filter,
  query_str,
  language,
  includeSummary,
  customerId,
  corpusId,
  endpoint,
  apiKey,
  exactKeyword,
}: Config) => {
  const lambda =
    (exactKeyword == "true") ? 1 :
    typeof query_str === "undefined" || query_str.trim().split(" ").length > 1
      ? 0.025
      : 0.1;

  console.log(lambda,"lambda");
  const corpusKeyList = corpusId.split(",").map((id) => {
    return {
      customerId,
      corpusId: id,
      lexical_interpolation_config: {
        lambda: lambda,
      },
      metadataFilter: filter ? `doc.source = '${filter}'` : undefined,
    };
  });

  const body = {
    query: [
      {
        query: query_str,
        start: 0,
        numResults: 20,
        corpusKey: corpusKeyList,
        context_config: {
          sentencesBefore: 5,
          sentencesAfter: 15,
          start_tag: START_TAG,
          end_tag: END_TAG,
        },
        ...(includeSummary
          ? {
              summary: [
                {
                  summarizerPromptName: "vectara-summary-ext-v1.2.0",
                  responseLang: "eng",
                  maxSummarizedResults: 7,
                },
              ],
            }
          : {}),
      },
    ],
  };

  const url = `https://${endpoint}/v1/query`;
  const headers = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "customer-id": customerId,
      "x-api-key": apiKey,
      "grpc-timeout": "60S",
    },
  };
  const result = await axios.post(url, body, headers);

  const status = result["data"]["responseSet"][0]["status"];
  if (status.length > 0 && status[0]["code"] === "UNAUTHORIZED") {
    console.log("UNAUTHORIZED access; check your API key and customer ID");
  }

  console.log(result, "reuslts");

  return result["data"]["responseSet"][0];
};

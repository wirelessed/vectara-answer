import { DeserializedSearchResult } from "../types";
import {
  VuiCallout,
  VuiFlexContainer,
  VuiFlexItem,
  VuiSpinner,
  VuiTextColor,
  VuiText,
  VuiTitle,
  VuiSpacer
} from "../../../ui";
import { SearchResultList } from "./SearchResultList";

type Props = {
  isSearching: boolean;
  searchError?: any;
  results?: DeserializedSearchResult[];
  selectedSearchResultPosition?: number;
  setSearchResultRef: (el: HTMLDivElement | null, index: number) => void;
};

export const SearchResults = ({
  isSearching,
  searchError,
  results,
  selectedSearchResultPosition,
  setSearchResultRef
}: Props) => {
  let content;
  if (isSearching) {
    // Loading indicator.
    content = (
      <VuiFlexContainer alignItems="center">
        <VuiFlexItem>
          <VuiSpinner size="xs" />
        </VuiFlexItem>

        <VuiFlexItem grow={false}>
          <VuiTitle size="xs" align="center">
            <h2>Retrieving references&hellip;</h2>
          </VuiTitle>
        </VuiFlexItem>
      </VuiFlexContainer>
    );
  } else if (searchError) {
    // Log for diagnostics.
    console.error(searchError);
    content = (
      <VuiCallout title="There was an error while searching" color="danger" headingElement="h2">
        {searchError.message && (
          <VuiText>
            <p>
              <VuiTextColor color="danger">{searchError.message}</VuiTextColor>
            </p>
          </VuiText>
        )}
        {searchError.response?.data?.message && (
          <VuiText>
            <p>
              <VuiTextColor color="danger">{searchError.response.data.message}</VuiTextColor>
            </p>
          </VuiText>
        )}
      </VuiCallout>
    );
  } else if (results) {
    content = (
      <SearchResultList
        results={results}
        selectedSearchResultPosition={selectedSearchResultPosition}
        setSearchResultRef={setSearchResultRef}
      />
    );
  }

  return (
    <>
      <VuiTitle size="xxs">
        <h2>
          <strong>References</strong>
          <small><br/>Currently, the transcript preview is not available yet.</small>
        </h2>
      </VuiTitle>

      <VuiSpacer size="s" />

      {content}
    </>
  );
};

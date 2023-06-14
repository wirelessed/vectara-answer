import { useState } from "react";
import {
  VuiButton,
  VuiFlexContainer,
  VuiFlexItem,
  VuiHorizontalRule,
  VuiSpacer,
  VuiSpinner,
  VuiTitle,
} from "../../ui";
import { SearchControls } from "./controls/SearchControls";
import { Summary } from "./results/Summary";
import { SearchResults } from "./results/SearchResults";
import { ExampleQuestions } from "./controls/ExampleQuestions";
import { useSearchContext } from "../../contexts/SearchContext";
import { AppHeader } from "./chrome/AppHeader";
import { AppFooter } from "./chrome/AppFooter";
import { useConfigContext } from "../../contexts/ConfigurationContext";
import { HistoryDrawer } from "./controls/HistoryDrawer";
import "./searchView.scss";
import copy from 'copy-to-clipboard';

function combineFirstTenStrings(objects: { text: string }[]): string {
  const firstTenObjects = objects.slice(0, 10);
  let combinedString = firstTenObjects.reduce((result, obj) => {
    return result + obj.text;
  }, "");

  // combinedString = combinedString.substring(0, 4000);

  return combinedString;
}

export const SearchView = () => {
  const { isConfigLoaded, app } = useConfigContext();

  const {
    isSearching,
    searchError,
    searchResults,
    searchResponse,
    searchValue,
    isSummarizing,
    summarizationError,
    summarizationResponse,
    searchResultsRef,
    selectedSearchResultPosition,
    selectSearchResultAt,
  } = useSearchContext();

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  let content;

  // create prompt for chatGPT
  let prompt = "You are now a ghost writer for Pastor Joseph Prince. Write a friendly, encouraging answer to this question '" + searchValue + 
  "' based on the following context, keeping the original tone of voice, with a key practical actionable takeaway at the end: \n\n";

  if(searchResponse){
    prompt += combineFirstTenStrings(searchResponse.response);
    console.log(prompt, "prompt");
  }

  if (!isConfigLoaded) {
    content = (
      <VuiFlexContainer
        className="appSpinner"
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <VuiSpinner size="l" />
        <VuiSpacer size="l" />
        <VuiTitle size="xs">
          <h2>Loading</h2>
        </VuiTitle>
      </VuiFlexContainer>
    );
  } else if (
    !isSearching &&
    !searchError &&
    !searchResults &&
    !isSummarizing &&
    !summarizationError &&
    !summarizationResponse
  ) {
    content = <ExampleQuestions />;
  } else {
    const summary = summarizationResponse?.summary[0]?.text;
    content = (
      <>
        <VuiSpacer size="s" />

        <Summary
          isSummarizing={isSummarizing}
          summarizationError={summarizationError}
          summary={summary}
          selectedSearchResultPosition={selectedSearchResultPosition}
          onClickCitation={(position: number) =>
            selectSearchResultAt(position - 1)
          }
        />

        <VuiSpacer size="l" />

        <VuiHorizontalRule />

        <VuiSpacer size="l" />

        {!isSearching && (
        <VuiButton
          color="accent"
          size="m"
          onClick={() => {
            copy(prompt);
            window.open("https://chat.openai.com");
          }}
        >
          Copy excerpts to clipboard (and paste in your ChatGPT)
        </VuiButton>
        )}

        <VuiSpacer size="l" />

        <SearchResults
          isSearching={isSearching}
          searchError={searchError}
          results={searchResults}
          selectedSearchResultPosition={selectedSearchResultPosition}
          setSearchResultRef={(el: HTMLDivElement | null, index: number) =>
            ((searchResultsRef as any).current[index] = el)
          }
        />
      </>
    );
  }

  return (
    <>
      {app.isHeaderEnabled && <AppHeader />}
      <VuiFlexContainer
        className="searchView"
        direction="column"
        alignItems="center"
        spacing="none"
      >
        {isConfigLoaded && (
          <VuiFlexItem className="searchControlsContainer">
            <SearchControls
              isHistoryOpen={isHistoryOpen}
              onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
              hasQuery={Boolean(isSearching || searchResults)}
            />
          </VuiFlexItem>
        )}

        <VuiFlexItem grow={1} className="searchContent">
          {content}
        </VuiFlexItem>

        <HistoryDrawer
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
        />

        {app.isFooterEnabled && <AppFooter />}
      </VuiFlexContainer>
    </>
  );
};

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
    return result + " " + obj.text + "\n\n\n";
  }, "");

  combinedString = combinedString.replace(/%START_SNIPPET%/g, "");
  combinedString = combinedString.replace(/%END_SNIPPET%/g, "");
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
  let prompt = "You are a pastoral writer. You establish a compassionate and empowering tone throughout the content. You employ a conversational but authoritative voice, making the reader feel guided and cared for. The underlying emotional resonance is one of hope, faith, and transformation, facilitated through intimate storytelling and inviting dialogues. Your persona can be summarized as a trusted spiritual guide, brimming with wisdom and empathy, encouraging its audience to conquer life's adversities and embrace personal growth with faith and courage. "
  + "Write a friendly, encouraging answer to this question '" + searchValue + 
  "' based on the following context, keeping the original tone of voice, with a key practical actionable takeaway at the end: \n\n";

  if(searchResponse){
    prompt += combineFirstTenStrings(searchResponse.response);
    // console.log(prompt, "prompt");
  }

  // console.log(searchResults,"results");
  // console.log(searchResponse,"searchResponse");


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
          <>
        <VuiButton
          color="accent"
          size="m"
          onClick={() => {
            copy(prompt);
            window.open("https://chat.openai.com");
          }}
        >
          Click here to copy excerpts to clipboard (and then paste in your ChatGPT)
        </VuiButton>
          <small style={{paddingTop: '10px'}}>The 1st 5 excerpts will be automatically copied. Press CTRL+V or CMD+V to paste in your ChatGPT window and enter to see a better write-up.</small>
          </>
        )}

        <VuiSpacer size="l" />
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

import { useConfigContext } from "../../../contexts/ConfigurationContext";
import { VuiFlexContainer, VuiFlexItem, VuiIcon, VuiPrompt, VuiSpacer, VuiTextColor, VuiText } from "../../../ui";
import { useSearchContext } from "../../../contexts/SearchContext";
import "./exampleQuestions.scss";

export const ExampleQuestions = () => {
  const { exampleQuestions } = useConfigContext();
  const { onSearch } = useSearchContext();
  const hasExampleQuestions = exampleQuestions.length > 0;

  if (!hasExampleQuestions) return null;

  return (
    <div>
      <VuiSpacer size="s" />

      <VuiText size="s">
        <p>
          <VuiTextColor color="accent">Search for any topic or question within our transcripts. <br/>(You don't have to use exact keywords as the AI will understand the semantics and meaning of your query.)</VuiTextColor>
        </p>
      </VuiText>

      <VuiSpacer size="m" />

      <VuiFlexContainer spacing="m" wrap className="promptList">
        {exampleQuestions.map((exampleQuestion) => (
          <VuiFlexItem grow={1} key={exampleQuestion}>
            <VuiPrompt
              key={exampleQuestion}
              className="prompt"
              onClick={() => {
                onSearch({ value: exampleQuestion });
              }}
            >
              {exampleQuestion}
            </VuiPrompt>
          </VuiFlexItem>
        ))}
      </VuiFlexContainer>
    </div>
  );
};

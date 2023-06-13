import { VuiFlexContainer, VuiFlexItem, VuiTitle, VuiText, VuiLink, VuiSpacer, VuiButton } from "../../../ui";
import "./appFooter.scss";

export const AppFooter = () => {
  return (
    <div className="appFooter">
      <div className="appFooterContent">
        <VuiFlexContainer alignItems="start" spacing="l" className="appFooterContent__layout">
          <VuiFlexItem grow={5}>
            <VuiTitle size="m">
              <h3>How Vectara works?</h3>
            </VuiTitle>

            <VuiSpacer size="m" />

            <VuiText>
              <p>
              Vectara is a neural search platform that uses artificial intelligence, natural language processing, and neural network technologies to deliver unparalleled search relevance.
              </p>
              <p>Vectara uses its neural network to convert that query from the language space, meaning the vocabulary and the grammar, into the vector space, which is numbers and math.</p>
              <p>Vectara maps the input query from language space to a meaning space, then it matches meaning-to-meaning to return accurate results, irrespective of language.</p>
            </VuiText>

            <VuiSpacer size="m" />

            {/* <div>
              <VuiButton color="accent" size="m" href="https://console.vectara.com/" target="_blank">
                Try Vectara now
              </VuiButton>
            </div> */}
          </VuiFlexItem>

          <VuiFlexItem grow={5}>
            <VuiTitle size="m">
              <h3>A conversational search API platform</h3>
            </VuiTitle>

            {/* <VuiSpacer size="m" />

            <VuiText>
              <p>
                Vectara is an API platform for developers. It features best-in-class retrieval and summarization. The
                best part is we built in grounded generation which all but eliminates hallucinations.
              </p>
            </VuiText>

            <VuiSpacer size="s" />

            <VuiFlexContainer>
              <VuiFlexItem grow={5}>
                <VuiText>
                  <p>
                    <VuiLink href="https://vectara.com/" target="_blank">
                      Vectara
                    </VuiLink>
                  </p>
                  <p>
                    <VuiLink href="https://discord.gg/GFb8gMz6UH" target="_blank">
                      Discord
                    </VuiLink>
                  </p>
                </VuiText>
              </VuiFlexItem>

              <VuiFlexItem grow={5}>
                <VuiText>
                  <p>
                    <VuiLink href="https://docs.vectara.com/" target="_blank">
                      Docs
                    </VuiLink>
                  </p>

                  <p>
                    <VuiLink href="https://discuss.vectara.com/" target="_blank">
                      Forums
                    </VuiLink>
                  </p>
                </VuiText>
              </VuiFlexItem> */}
            {/* </VuiFlexContainer> */}
          </VuiFlexItem>
        </VuiFlexContainer>
      </div>
    </div>
  );
};

import { forwardRef } from "react";
import classNames from "classnames";
import { VuiTitle } from "../typography/Title";
import { VuiLink } from "../link/Link";
import { VuiSpacer } from "../spacer/Spacer";
import { VuiText } from "../typography/Text";
import { VuiTextColor } from "../typography/TextColor";

export type SearchResultType = {
  id?: string;
  title?: string;
  url?: string;
  date?: string;
  snippet: {
    pre: string;
    text: string;
    post: string;
  };
};

type Props = {
  result: SearchResultType;
  position: number;
  isSelected?: boolean;
  subTitle?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  snippetProps?: any;
};

const highlightUrl = (url: string, text: string) => `${url}#:~:text=${text}`;

export const VuiSearchResult = forwardRef<HTMLDivElement | null, Props>(
  ({ result, position, isSelected, subTitle, children, className, snippetProps, ...rest }: Props, ref) => {
    const {
      title,
      id,
      url,
      date,
      snippet: { pre, post, text }
    } = result;

    const classes = classNames("vuiSearchResult", className);

    const positionClasses = classNames("vuiSearchResultPosition", {
      "vuiSearchResultPosition--selected": isSelected
    });

    const year = id ? id.substring(0,4) : '';
    const fileUrl = "smb://10.5.1.20/Transcripts/" + year + "/" + encodeURIComponent(id ?? '');

    return (
      <div className={classes} ref={ref} {...rest}>
        <div className={positionClasses}>{position}</div>

        {(title || id) && (
          <VuiTitle size="s">
              <VuiLink href={fileUrl} target="_blank">
                <h3>{title ?? id}</h3>
              </VuiLink>
          </VuiTitle>
        )}

        {subTitle && (
          <>
            {title && <VuiSpacer size="xs" />}
            {subTitle}
          </>
        )}

        <VuiText {...snippetProps} size="s">
          <p>
            {date && <VuiTextColor color="subdued">{date} &#8212; </VuiTextColor>}
            {pre} <strong>{text}</strong> {post}
          </p>
        </VuiText>

        {children && (
          <>
            <VuiSpacer size="s" />
            {children}
          </>
        )}
      </div>
    );
  }
);

import {
  type AnnotationHandler,
  InnerLine,
  InnerPre,
  InnerToken,
} from "codehike/code";

export const wordWrap: AnnotationHandler = {
  name: "word-wrap",
  // @ts-expect-error - filter dev tool prop
  Pre: ({ "data-insp-path": _, ...props }) => (
    <InnerPre merge={props} className="whitespace-pre-wrap" />
  ),
  // @ts-expect-error - filter dev tool prop
  Line: ({ "data-insp-path": _, ...props }) => (
    <InnerLine merge={props}>
      <div
        style={{
          textIndent: `${-props.indentation}ch`,
          marginLeft: `${props.indentation}ch`,
        }}
      >
        {props.children}
      </div>
    </InnerLine>
  ),
  // @ts-expect-error - filter dev tool prop
  Token: ({ "data-insp-path": _, ...props }) => (
    <InnerToken merge={props} style={{ textIndent: 0 }} />
  ),
};

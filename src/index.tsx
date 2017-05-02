import * as React from "react";

export type DivProps = React.HTMLProps<HTMLImageElement>;
export type ImageProps = React.HTMLProps<HTMLDivElement>;

export interface ProgressiveImageProps {
    preview: string;
    src: string;
    background?: boolean;
    backgroundImages?: string[];
    transitionTime?: number;
    timingFunction?: string;
    maxBlur?: number;
}

export interface ProgressiveImageState {
    src: string;
    blur: number;
}

export class ProgressiveImage extends React.Component<ProgressiveImageProps & DivProps & ImageProps, ProgressiveImageState> {

    private clonedProps: React.HTMLProps<HTMLDivElement & HTMLImageElement> = {};

    static defaultProps = {
        transitionTime: 500,
        timingFunction: "ease",
        maxBlur: 10
    };

    componentWillMount() {
        const {src, preview, maxBlur} = this.props;
        this.setState({ src: "", blur: maxBlur as number });
        this.cloneProps();
        this.fetch(preview)
            .then(previewDataURI => this.setState({ src: previewDataURI, blur: maxBlur as number }))
            .then(() => this.fetch(src))
            .then(srcDataURI => this.setState({ src: srcDataURI, blur: 0 }));
    }
    render() {
        const {src, style, background} = this.props;
        return background ?
            <div style={Object.assign(this.getBackgroundStyle(), style)} {...this.clonedProps}>{this.props.children}</div>
            :
            <img src={src} style={Object.assign(this.getStyle(), style)} {...this.clonedProps} />
            ;
    }

    private fetch(src: string): Promise<string> {
        return new Promise(resolve => {
            const image = new Image();
            image.src = src;
            image.addEventListener("load", () => resolve(src), false);
        });
    }

    private cloneProps() {
        Object.keys(this.props)
            .filter(prop => ["style", "src", "preview", "background", "transitionTime", "timingFunction", "backgroundImages", "maxBlur", "children"].indexOf(prop) === -1)
            .forEach(prop => this.clonedProps[prop] = this.props[prop]);
    }

    private getStyle() {
        const {transitionTime, timingFunction} = this.props;
        const {blur} = this.state;
        return {
            filter: `blur(${blur}px)`,
            transition: `filter ${transitionTime}ms ${timingFunction}`
        };
    }

    private getBackgroundStyle() {
        const {src} = this.state;
        const {backgroundImages} = this.props;
        const style = {
            backgroundImage: `${backgroundImages ? `${backgroundImages.join(",")},` : ""}url(${src})`
        };
        return Object.assign(style, this.getStyle());
    }
}

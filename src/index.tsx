import {assign} from "lodash";
import * as React from "react";

export type DivProps = React.HTMLProps<HTMLImageElement>;
export type ImageProps = React.HTMLProps<HTMLDivElement>;

export interface ProgressiveImageProps {
    preview: string;
    src: string;
    background?: boolean;
    transitionTime?: number;
    timingFunction?: string;
}

export interface ProgressiveImageState {
    src: string;
    blur: number;
}

export class ProgressiveImage extends React.Component<ProgressiveImageProps & DivProps & ImageProps, ProgressiveImageState> {

    private clonedProps: React.HTMLProps<HTMLDivElement | HTMLImageElement> = {};

    static defaultProps = {
        transitionTime: 500,
        timingFunction: "ease"
    };

    componentWillMount() {
        const {src, preview} = this.props;
        this.setState({ src: "", blur: 10 });
        this.cloneProps();
        fetch(preview)
            .then(() => this.setState({ src: preview, blur: 10 }))
            .then(() => fetch(src))
            .then(() => this.setState({ src, blur: 0 }));
    }

    render() {
        const {src, style, background} = this.props;
        return background ?
            <div style={assign(this.getBackgroundStyle(), style)} {...this.clonedProps} />
        :
            <img src={src} style={assign(this.getStyle(), style)} {...this.clonedProps} />
        ;
    }

    private cloneProps() {
        Object.keys(this.props)
            .filter(prop => ["style", "src", "preview", "background"].indexOf(prop) === -1)
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
        const style = {
            backgroundImage: `url(${src})`
        };
        return assign(style, this.getStyle());
    }
}

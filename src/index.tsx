import {assign} from "lodash";
import * as React from "react";

export type DivProps = React.HTMLProps<HTMLImageElement>;
export type ImageProps = React.HTMLProps<HTMLDivElement>;

export interface ProgressiveImageProps {
    preview: string;
    src: string;
    background?: boolean;
}

export interface ProgressiveImageState {
    src: string;
    blur: number;
}

export class ProgressiveImage extends React.Component<ProgressiveImageProps & DivProps & ImageProps, ProgressiveImageState> {

    private clonedProps: React.HTMLProps<HTMLDivElement | HTMLImageElement> = {};

    componentWillMount() {
        const {src, preview} = this.props;
        this.setState({ src: preview, blur: 10 });
        this.cloneProps();
        fetch(src).then(() => this.setState({ src, blur: 0 }));
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
        const {blur} = this.state;
        return {
            filter: `blur(${blur}px)`,
            transition: "filter 500ms ease"
        };
    }

    private getBackgroundStyle() {
        const {src, blur} = this.state;
        return {
            backgroundImage: `url(${src})`,
            filter: `blur(${blur}px)`,
            transition: "filter 500ms ease"
        };
    }
}

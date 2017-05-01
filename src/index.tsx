import * as React from "react";

export interface ProgressiveImageProps extends React.HTMLProps<HTMLDivElement> {
    preview: string;
    src: string;
}

export interface ProgressiveBackgroundImageProps extends  React.HTMLProps<HTMLImageElement> {
    preview: string;
    src: string;
    background: boolean;
}

export interface ProgressiveImageState {
    src: string;
    blur: number;
}

export class ProgressiveImage extends React.Component<ProgressiveImageProps & ProgressiveBackgroundImageProps, ProgressiveImageState> {

    private clonedProps: React.HTMLProps<HTMLDivElement | HTMLImageElement> = {};

    componentWillMount() {
        const {src, preview} = this.props;
        this.setState({ src: preview, blur: 10 });
        this.cloneProps();
        fetch(src).then(() => this.setState({ src, blur: 0 }));
    }

    render() {
        const {src, style, background} = this.props;
        return (
            <div>
                <style>{`
                @-webkit-keyframes blur {
                    0%  { -webkit-filter: blur(10px); }
                    100% { -webkit-filter: blur(0); }
                }
                `}</style>
                {
                    background ?
                        <div style={Object.assign(this.getBackgroundStyle(), style)} {...this.clonedProps} />
                    :
                        <img src={src} style={Object.assign(this.getStyle(), style)} {...this.clonedProps} />
                }

            </div>
        );
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
            animation: "blur 400ms",
            animationTimingFunction: "ease"
        };
    }

    private getBackgroundStyle() {
        const {src, blur} = this.state;
        return {
            backgroundImage: `url(${src})`,
            filter: `blur(${blur}px)`,
            animation: "blur 400ms",
            animationTimingFunction: "ease"
        };
    }
}
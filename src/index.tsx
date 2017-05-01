import * as React from "react";

interface ProgressiveImageProps extends React.HTMLProps<HTMLDivElement> {
    preview: string;
    src: string;
    background?: boolean;
}

interface ProgressiveImageState {
    src: string;
    blur: number;
}

class ProgressiveImage extends React.Component<ProgressiveImageProps, ProgressiveImageState> {

    private clonedProps: React.HTMLProps<HTMLDivElement> = {};

    componentWillMount() {
        const {src, preview} = this.props;
        this.setState({ src: preview, blur: 10 });
        this.cloneProps();
        fetch(src).then(() => this.setState({ src, blur: 0 }));
    }

    render() {
        const {style} = this.props;
        return (
            <div>
                <style>{`
                @-webkit-keyframes blur {
                    0%  { -webkit-filter: blur(10px); }
                    100% { -webkit-filter: blur(0); }
                }
                `}</style>
                <div style={Object.assign(this.getStyle(), style)} {...this.clonedProps} />
            </div>
        );
    }

    private cloneProps() {
        Object.keys(this.props)
            .filter(prop => ["style", "src", "preview", "background"].indexOf(prop) === -1)
            .forEach(prop => this.clonedProps[prop] = this.props[prop]);
    }

    private getStyle() {
        const {src, blur} = this.state;
        return {
            backgroundImage: `url(${src})`,
            filter: `blur(${blur}px)`,
            animation: "blur 400ms",
            animationTimingFunction: "ease"
        };
    }
}
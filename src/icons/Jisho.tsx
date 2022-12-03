import { SVGProps } from "react";

export function Jisho(props: SVGProps<SVGSVGElement>) {
    return (
        <svg height="1em" width="1em" viewBox="0 0 520 340" {...props}>
            <g>
                <path fill="#ffffff"
                    d="M20,280 L20,30 C20,30 20,20 30,20 C45,20 190,20 190,20 C190,20 245,20 245,70 C245,120 245,320 245,320 C245,320 245,280 200,280 C155,280 20,280 20,280 z"
                />
                <path fill="#ffffff" 
                    d="M480,280 L480,30 C480,30 480,20 470,20 C460,20 315,20 315,20 C315,20 260,20 260,70 C260,120 260,320 260,320 C260,320 260,280 300,280 C350,280 480,280 480,280 z"
                    transform="translate(20,0)" />
            </g>
        </svg>
    );
}

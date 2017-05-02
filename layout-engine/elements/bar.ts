import { Element, Space } from './element';
import { Context } from '../graphics/context';
import { Scale, ScaleType, ScaleModel } from '../scales/scale';

export interface BarOptions {
    flip?: boolean;
    minHeight?: number;
    minWidth?: number;
    padding?: number;
}

const defaultBarOptions: BarOptions = {
    flip: false,
    minHeight: 16,
    minWidth: 4,
    padding: 0.25
};

export type BarScales = ScaleModel & {
    x: Scale<any, number>;
    y: Scale<any, number>;
};

class BarGroup implements Element {

    data: Object[];
    scales: BarScales;
    options: BarOptions;

    constructor(
        data: Object[],
        scales: BarScales,
        options: BarOptions) {

        this.data = data;
        this.scales = scales;
        this.options = Object.assign({},
            defaultBarOptions,
            options);
    }

    getRequiredSpace(awailableSpace?: Space): Space {

        const opt = this.options;
        const { data, scales } = this;

        const count = data.length;
        if (count === 0) {
            return {
                stakes: [[0, 0], [0, 0]],
                bounds: [[0, 0], [0, 0]]
            };
        }

        const barWidth = opt.minWidth;

        const stakes: [number, number] = [
            count * barWidth + (count - 1) * opt.padding * barWidth,
            opt.minHeight
        ];
        const bounds: [number, number] = [
            stakes[0],
            stakes[1] + scales.x.type === ScaleType.Continuous ? barWidth : 0
        ];
        if (opt.flip) {
            stakes.reverse();
            bounds.reverse();
        }

        return {
            stakes: [[0, 0], stakes],
            bounds: [[0, 0], bounds]
        };
    }

    draw(context: Context) {

        const { data, scales } = this;

        context.fillStyle({ color: '#d42' });

        data.forEach((d) => {
            const x = scales.x.from(d);
            const y = scales.y.from(d);
            const y0 = scales.y.value(0);
            const w = this.options.minWidth;
            const x0 = x - w / 2;
            const h = Math.abs(y - y0);

            context
                .rect(x0, y0, w, h)
                .fill();
        });

    }

}

class Bar {

}

export default function createBarGroup(
    data: Object[],
    scales: BarScales,
    options: BarOptions = {}) {

    return new BarGroup(data, scales, options);
}

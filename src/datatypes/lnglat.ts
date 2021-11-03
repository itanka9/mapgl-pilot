export class LngLat {
    private lng: number;
    private lat: number;

    constructor (lng: number, lat: number) {
        this.lng = lng;
        this.lat = lat;
    }

    toString () {
        return `${this.lng.toFixed(6)}, ${this.lat.toFixed(6)}`
    }

    toArray () {
        return [this.lng, this.lat]
    }

    static parse (ll: string): LngLat {
        const parts = ll.split(',').map(Number);
        return new LngLat(parts[0], parts[1]);
    }

    static fromArray (arr: number[]): LngLat {
        return new LngLat(arr[0], arr[1]);
    }

}
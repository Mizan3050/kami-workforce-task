export class ListParams<F = any> {
    constructor(
        public filter: F = null as any,
        public _start = 0,
        public _limit = 20,
        public _sort?: string
    ) { }
}
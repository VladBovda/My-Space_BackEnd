import {Exhibit} from "../exhibit.entity";

export interface PaginatedExhibits {
    data: Exhibit[];
    total: number;
    page: number;
    lastPage: number;
}


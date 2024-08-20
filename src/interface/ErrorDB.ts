export interface Main {
    ok:      boolean;
    message: string;
    error?:   Error;
}

export interface ErrorDB {
    query?:       string;
    parameters?:  null[];
    length:       number;
    severity:     string;
    code:         string;
    detail:       string;
    schema:       string;
    table:        string;
    column:       string;
    file:         string;
    line:         string;
    routine:      string;
    name?:        string;
}

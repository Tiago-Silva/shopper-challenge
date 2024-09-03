


export interface Usecase<InputDTO, OutputDTO> {
    exec(input: InputDTO): Promise<OutputDTO>;
}

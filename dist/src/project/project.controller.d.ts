import { ProjectService } from './project.service';
import { Project } from 'src/entities/project.entity';
import { CreateProjectDto } from './dto/CreateProjectDto';
export declare class ProjectController {
    private readonly projectService;
    constructor(projectService: ProjectService);
    create(createProjectDto: CreateProjectDto): Promise<Project>;
    findAll(): Promise<Project[]>;
    findOne(id: string): Promise<Project>;
}

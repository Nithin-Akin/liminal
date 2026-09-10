from pydantic import BaseModel, Field


class ProfileRequest(BaseModel):
    profile: dict


class AgentQuery(BaseModel):
    question: str = Field(min_length=1, max_length=4000)
    location: dict | None = None


class CheckinRequest(BaseModel):
    day_number: int = Field(ge=1, le=90)
    transition_type: str = Field(min_length=1, max_length=80)
    mood: int = Field(ge=1, le=5)
    note: str = Field(default="", max_length=4000)
    profile: dict = {}


class GenerateTasksRequest(BaseModel):
    force: bool = False
    location: dict | None = None


class TaskCompleteRequest(BaseModel):
    task_id: str = Field(min_length=1, max_length=120)


class Recommendation(BaseModel):
    name: str
    comparison: dict[str, str] = {}
    source_url: str
    source_type: str
    fit_reason: str


class AgentAnswer(BaseModel):
    title: str
    summary: str
    plan: list[str]
    recommendations: list[Recommendation] = []
    next_action: str
    last_checked: str


class TaskOption(BaseModel):
    name: str
    values: dict[str, str] = {}
    fit_reason: str


class AgentTask(BaseModel):
    id: str
    category: str
    title: str
    priority: int = Field(ge=1)
    icon: str
    image_url: str | None = None
    why_now: str
    search_url: str | None = None
    source_type: str
    last_checked: str
    comparison_fields: list[str] = []
    options: list[TaskOption] = []
    next_action: str


class AgentTaskResponse(BaseModel):
    summary: str
    source_policy: str
    tasks: list[AgentTask]

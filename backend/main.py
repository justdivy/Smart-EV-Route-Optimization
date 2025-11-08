from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from algorithms.dijkstra import find_best_route

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Smart EV Charging Route Planner API"}

@app.get("/route")
def get_route(source: str, destination: str, battery: int = 8):
    result = find_best_route(source, destination, battery)
    return result

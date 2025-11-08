import heapq

# Graph representation (distance between nodes)
graph = {
    "A": {"B": 4, "C": 2},
    "B": {"A": 4, "C": 5, "D": 10},
    "C": {"A": 2, "B": 5, "D": 3},
    "D": {"B": 10, "C": 3}
}

charging_stations = ["B", "C"]

def find_best_route(start, end, battery_range=8):
    queue = [(0, start, [start], battery_range)]
    visited = set()

    while queue:
        cost, node, path, remaining_battery = heapq.heappop(queue)
        state = (node, remaining_battery)

        if state in visited:
            continue
        visited.add(state)

        # 🔋 If reached destination
        if node == end:
            return {
                "path": path,
                "distance": cost,
                "charging_stops": [n for n in path if n in charging_stations],
                "battery_left": remaining_battery
            }

        for neighbor, weight in graph[node].items():
            if weight > remaining_battery:
                continue  # Can't reach next node on current battery

            # If neighbor is a charging station, recharge to full
            new_battery = battery_range if neighbor in charging_stations else remaining_battery - weight
            heapq.heappush(queue, (cost + weight, neighbor, path + [neighbor], new_battery))

    return {"error": "No feasible route found. Battery insufficient."}

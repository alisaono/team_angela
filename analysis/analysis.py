import json
import os


def load_dir(dir_name):
    data = []
    for file in os.listdir("./" + dir_name):
        if file.endswith(".json"):
            with open(os.path.join("./" + dir_name, file)) as data_file:
                data.extend(json.load(data_file))
    return data


def load_files(file_names):
    data = []
    for file in file_names:
        with open(os.path.join("./", file)) as data_file:
            data.extend(json.load(data_file))
    return data


def calculate_average(data, state_set_idx):
    data_by_sets = {}

    for d in data:
        time = d[0]
        state_set = "".join(d[state_set_idx])
        if state_set in data_by_sets:
            prev_cnt, prev_time = data_by_sets[state_set]
            data_by_sets[state_set] = (prev_cnt + 1, prev_time + time)
        else:
            data_by_sets[state_set] = (1, time)

    total = 0
    for k, v in data_by_sets.items():
        total += v[1] / v[0]
    return total

# print('click:', calculate_average(load_dir('clicks'), 1))
# print('stab:', calculate_average(load_dir('stabs'), 2))
# print('wrap inclusive:', calculate_average(load_dir('inclusives'), 2))
# print('wrap exclusive:', calculate_average(load_dir('exclusives'), 2))
# print('hull:', calculate_average(load_dir('hulls'), 2))

# print('click:', calculate_average(load_files(['clicks/click1.json', 'clicks/gclick1.json', 'clicks/jclick1.json']), 1))
# print('stab:', calculate_average(load_files(['stabs/stab1.json', 'stabs/gstab1.json', 'stabs/jstab1.json']), 2))
# print('wrap inclusive:', calculate_average(load_files(['inclusives/wrap_inclusive1.json', 'inclusives/gwrap_inclusive1.json', 'inclusives/jwrap_inclusive1.json']), 2))
# print('wrap exclusive:', calculate_average(load_files(['exclusives/wrap_exclusive1.json', 'exclusives/gwrap_exclusive1.json', 'exclusives/jwrap_exclusive1.json']), 2))
# print('hull:', calculate_average(load_files(['hulls/hull1.json', 'hulls/ghull1.json', 'hulls/jhull1.json']), 2))

# print('click:', calculate_average(load_files(['clicks/click4.json', 'clicks/gclick4.json', 'clicks/jclick4.json']), 1))
# print('stab:', calculate_average(load_files(['stabs/stab4.json', 'stabs/gstab4.json', 'stabs/jstab4.json']), 2))
# print('wrap inclusive:', calculate_average(load_files(['inclusives/wrap_inclusive4.json', 'inclusives/gwrap_inclusive4.json', 'inclusives/jwrap_inclusive4.json']), 2))
# print('wrap exclusive:', calculate_average(load_files(['exclusives/wrap_exclusive4.json', 'exclusives/gwrap_exclusive4.json', 'exclusives/jwrap_exclusive4.json']), 2))
# print('hull:', calculate_average(load_files(['hulls/hull4.json', 'hulls/ghull4.json', 'hulls/jhull4.json']), 2))

def calculate_accuracy(data):
    accuracy = 0
    count = 0

    for d in data:
        selected = set(d[1])
        solution = set(d[2])
        fn = len(solution.difference(selected)) # in solution but not selected
        fp = len(selected.difference(solution)) # selected but not in solution
        tp = len(selected) - fp # selected and in solution
        if (tp + fp) == 0:
            continue
        precision = tp / (tp + fp)
        recall = tp / (tp + fn)
        if (precision * recall) != 0:
            accuracy += 2 * precision * recall / (precision + recall)
        count += 1

    return accuracy / count

# print('stab:', calculate_accuracy(load_dir('stabs')))
# print('wrap inclusive:', calculate_accuracy(load_dir('inclusives')))
# print('wrap exclusive:', calculate_accuracy(load_dir('exclusives')))
# print('hull:', calculate_accuracy(load_dir('hulls')))

# print('stab:', calculate_accuracy(load_files(['stabs/stab1.json', 'stabs/gstab1.json', 'stabs/jstab1.json'])))
# print('wrap inclusive:', calculate_accuracy(load_files(['inclusives/wrap_inclusive1.json', 'inclusives/gwrap_inclusive1.json', 'inclusives/jwrap_inclusive1.json'])))
# print('wrap exclusive:', calculate_accuracy(load_files(['exclusives/wrap_exclusive1.json', 'exclusives/gwrap_exclusive1.json', 'exclusives/jwrap_exclusive1.json'])))
# print('hull:', calculate_accuracy(load_files(['hulls/hull1.json', 'hulls/ghull1.json', 'hulls/jhull1.json'])))

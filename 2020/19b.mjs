import { getRawInput, autoparse, runTests, flatten } from '../lib.mjs';

const input = parseInput(getRawInput());

runTests(args => run(args), [
parseInput(`42: 9 14 | 10 1
9: 14 27 | 1 26
10: 23 14 | 28 1
1: "a"
11: 42 31
5: 1 14 | 15 1
19: 14 1 | 14 14
12: 24 14 | 19 1
16: 15 1 | 14 14
31: 14 17 | 1 13
6: 14 14 | 1 14
2: 1 24 | 14 4
0: 8 11
13: 14 3 | 1 12
15: 1 | 14
17: 14 2 | 1 7
23: 25 1 | 22 14
28: 16 1
4: 1 1
20: 14 14 | 1 15
3: 5 14 | 16 1
27: 1 6 | 14 18
14: "b"
21: 14 1 | 1 14
25: 1 1 | 1 14
22: 14 14
8: 42
26: 14 22 | 1 20
18: 15 15
7: 14 5 | 1 21
24: 14 1

abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa
bbabbbbaabaabba
babbbbaabbbbbabbbbbbaabaaabaaa
aaabbbbbbaaaabaababaabababbabaaabbababababaaa
bbbbbbbaaaabbbbaaabbabaaa
bbbababbbbaaaaaaaabbababaaababaabab
ababaaaaaabaaab
ababaaaaabbbaba
baabbaaaabbaaaababbaababb
abbbbabbbbaaaababbbbbbaaaababb
aaaaabbaabaaaaababaa
aaaabbaaaabbaaa
aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
babaaabbbaaabaababbaabababaaab
aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba`), 12
]);

console.log(run(input));

function run([rules, input]) {
	rules = new Map(rules.map(r => r.split(': ')));

	rules.set('8', '42 | 42 8');
	rules.set('11', '42 31 | 42 11 31');

	return input.filter(i => consume(rules, '0', i).includes('')).length;
}

function consume(rules, rule, input) {
	let match;
	if (match = /^"(\w)"$/.exec(rule)) {
		if (input[0] === match[1]) {
			return [input.slice(1)];
		} else {
			return [];
		}
	} else if (/^(\d+)$/.test(rule)) {
		return consume(rules, rules.get(rule), input);
	} else if (/\|/.test(rule)) {
		const subrules = rule.split(' | ');
		return flatten(subrules.map(subrule => consume(rules, subrule, input)));
	} else {
		const subrules = rule.split(' ');
		let result = [input];
		for (let subrule of subrules) {
			result = flatten(result.map(x => consume(rules, subrule, x)));
		}
		return result;
	}
}

function parseInput(str) {
	return autoparse(str);
}

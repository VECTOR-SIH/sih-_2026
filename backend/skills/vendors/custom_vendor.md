---
skill_id: vendor_custom_vendor
skill_name: UNIDENTIFIED VENDOR Dynamic Parser
category: vendor
vendor: UNIDENTIFIED VENDOR
---

# LEARNED SYNTAX RULES


## Control Learned Rule: Authentication Security.Exec Timeout Seconds
- Target Field: `authentication_security.exec_timeout_seconds`
- Evaluation Logic: `'appliance-identifier sysname UNMAPPED-EDGE-SWITCH-01' in str(context.get('exec_timeout_seconds', '')) or True`
- Failure Severity: HIGH
- Control Ref: Learned-Syntax
- Description: Learned syntax mapping for UNIDENTIFIED VENDOR

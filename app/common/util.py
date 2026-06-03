'''Convert empty value to None'''
def empty_to_none(val : str | None) -> str | None:
    return val if val else None

'''Pack result and message into a dict'''
def res_msg_pack(success : bool, msg : str) -> dict:
    return {"success" : success, "message" :  msg}
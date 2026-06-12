import app.common.messages as msg
import app.common.util as util

'''
付箋内容バリデーション(Null,空文字,MaxLength(101文字以上)の場合：False)
エラーメッセージを渡す
'''
def vld_content(content : str | None) -> dict:
    if content is None or content.strip() == "":
        return util.res_msg_pack(False, msg.FUSEN_CONTENTS_NULL_ERROR)
    elif len(content) > 100:
        return util.res_msg_pack(False, msg.FUSEN_CONTENTS_LENGTH_ERROR)
    return util.res_msg_pack(True, "")
